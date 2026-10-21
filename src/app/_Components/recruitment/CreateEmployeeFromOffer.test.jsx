import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { fetchPrefill, toast } = vi.hoisted(() => {
  const t = Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  });
  return { fetchPrefill: vi.fn(), toast: t };
});

vi.mock("react-hot-toast", () => ({
  default: toast,
  toast,
}));

vi.mock("@/app/_Services/recruitment/page", () => ({
  useLazyGetHirePrefillQuery: () => [fetchPrefill, { isFetching: false }],
}));

vi.mock("@/app/_Components/Modal/EmployeeModal", () => ({
  default: ({ isOpen, warning }) =>
    isOpen ? (
      <div data-testid="employee-modal">
        {warning ? <span>{warning}</span> : null}
        Add Employee
      </div>
    ) : null,
}));

vi.mock("@/app/_Components/fleet/fleetTheme", () => ({
  fleet: {
    primaryBtn: "btn-primary",
    secondaryBtn: "btn-secondary",
  },
}));

vi.mock("next/link", () => ({
  default: ({ href, children, className }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

import CreateEmployeeFromOffer from "./CreateEmployeeFromOffer";

describe("CreateEmployeeFromOffer", () => {
  beforeEach(() => {
    fetchPrefill.mockReset();
    toast.mockClear();
    toast.error.mockClear();
    window.confirm = vi.fn(() => true);
  });

  it("renders Create Employee button", () => {
    render(<CreateEmployeeFromOffer offerId="offer1" />);
    expect(
      screen.getByRole("button", { name: /Create Employee/i })
    ).toBeInTheDocument();
  });

  it("opens Add Employee modal with prefill when joining approved", async () => {
    const user = userEvent.setup();
    fetchPrefill.mockReturnValue({
      unwrap: async () => ({
        data: {
          prefill: { fullName: "Ali" },
          meta: { source: "recruitment", offerId: "offer1" },
          joiningApproved: true,
          warning: null,
          existingEmployee: null,
          duplicates: {},
        },
      }),
    });

    render(<CreateEmployeeFromOffer offerId="offer1" />);
    await user.click(screen.getByRole("button", { name: /Create Employee/i }));

    await waitFor(() => {
      expect(screen.getByTestId("employee-modal")).toBeInTheDocument();
    });
  });

  it("shows View Employee when already linked", async () => {
    const user = userEvent.setup();
    fetchPrefill.mockReturnValue({
      unwrap: async () => ({
        data: {
          existingEmployee: { _id: "emp99", fullName: "Ali" },
          duplicates: {},
        },
      }),
    });

    render(<CreateEmployeeFromOffer offerId="offer1" />);
    await user.click(screen.getByRole("button", { name: /Create Employee/i }));

    await waitFor(() => {
      expect(screen.getByRole("link", { name: /View Employee/i })).toHaveAttribute(
        "href",
        "/dashboard/employee/emp99"
      );
    });
  });

  it("blocks on duplicate email and shows View Employee", async () => {
    const user = userEvent.setup();
    fetchPrefill.mockReturnValue({
      unwrap: async () => ({
        data: {
          existingEmployee: null,
          duplicates: {
            email: { _id: "emp55", email: "a@b.com" },
          },
          joiningApproved: true,
        },
      }),
    });

    render(<CreateEmployeeFromOffer offerId="offer1" />);
    await user.click(screen.getByRole("button", { name: /Create Employee/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
      expect(screen.getByRole("link", { name: /View Employee/i })).toBeInTheDocument();
    });
  });

  it("confirms warning when joining not approved", async () => {
    const user = userEvent.setup();
    window.confirm = vi.fn(() => false);
    fetchPrefill.mockReturnValue({
      unwrap: async () => ({
        data: {
          prefill: {},
          meta: { source: "recruitment" },
          joiningApproved: false,
          warning: "Joining details are not approved. Some fields will be empty.",
          existingEmployee: null,
          duplicates: {},
        },
      }),
    });

    render(<CreateEmployeeFromOffer offerId="offer1" />);
    await user.click(screen.getByRole("button", { name: /Create Employee/i }));

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
    });
    expect(screen.queryByTestId("employee-modal")).not.toBeInTheDocument();
  });
});
