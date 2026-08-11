"use client";

import { User, Briefcase, Landmark, PhoneCall } from "lucide-react";
import {
  SectionCard,
  InfoItem,
  formatDate,
  formatMoney,
} from "./hrmsUi";

export default function BasicInfoTab({ employee }) {
  if (!employee) return null;
  return (
    <div className="space-y-4">
      <SectionCard icon={User} title="Personal Information">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoItem label="Full Name" value={employee.fullName} />
          <InfoItem label="Email" value={employee.email} />
          <InfoItem label="Phone" value={employee.phoneNo} />
          <InfoItem label="CNIC" value={employee.CNIC} />
          <InfoItem label="Date of Birth" value={formatDate(employee.dateOfBirth)} />
          <InfoItem label="Gender" value={employee.gender} />
          <InfoItem label="Marital Status" value={employee.maritalStatus} />
          <InfoItem label="Blood Group" value={employee.bloodGroup} />
          <InfoItem label="Status" value={employee.status} />
        </div>
        <div className="mt-4 pt-4 border-t border-zinc-100">
          <InfoItem label="Address" value={employee.address} />
        </div>
      </SectionCard>

      <SectionCard icon={PhoneCall} title="Emergency Contact">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoItem label="Name" value={employee.emergencyContact?.name} />
          <InfoItem label="Phone" value={employee.emergencyContact?.phone} />
          <InfoItem
            label="Relationship"
            value={employee.emergencyContact?.relationship}
          />
          <InfoItem label="Address" value={employee.emergencyContact?.address} />
        </div>
      </SectionCard>
    </div>
  );
}

export function EmploymentTab({ employee }) {
  if (!employee) return null;
  return (
    <div className="space-y-4">
      <SectionCard icon={Briefcase} title="Employment Details">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoItem label="Designation" value={employee.designation} />
          <InfoItem
            label="Department"
            value={employee.departmentId?.name || employee.departmentId}
          />
          <InfoItem label="Employment Type" value={employee.employmentType} />
          <InfoItem label="Joining Date" value={formatDate(employee.joiningDate)} />
          <InfoItem label="System Role" value={employee.role} />
          <InfoItem
            label="Basic Salary"
            value={formatMoney(employee.currentSalary)}
          />
        </div>
      </SectionCard>

      <SectionCard icon={Landmark} title="Banking & Tax">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoItem label="Bank Name" value={employee.bankName} />
          <InfoItem label="Account Title" value={employee.accountTitle} />
          <InfoItem label="Account Number" value={employee.accountNumber} />
          <InfoItem label="IBAN" value={employee.iban} />
          <InfoItem label="NTN" value={employee.ntn} />
        </div>
      </SectionCard>
    </div>
  );
}
