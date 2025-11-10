export const getAvailableTimeSlots = (selectedDate) => {
    const allTimeSlots = [
      { value: "09:00", label: "09:00 AM" },
      { value: "10:00", label: "10:00 AM" },
      { value: "11:00", label: "11:00 AM" },
      { value: "12:00", label: "12:00 PM" },
      { value: "13:00", label: "01:00 PM" },
      { value: "14:00", label: "02:00 PM" },
      { value: "15:00", label: "03:00 PM" },
      { value: "16:00", label: "04:00 PM" },
      { value: "17:00", label: "05:00 PM" },
    ]

    if (!selectedDate) return allTimeSlots

    const today = new Date()
    const selected = new Date(selectedDate)

    // If selected date is today, filter out past time slots
    if (selected.toDateString() === today.toDateString()) {
      const currentHour = today.getHours()
      return allTimeSlots?.filter((slot) => {
        const slotHour = Number.parseInt(slot.value.split(":")[0])
        return slotHour > currentHour
      })
    }

    // If selected date is in the future, show all slots
    return allTimeSlots
  }