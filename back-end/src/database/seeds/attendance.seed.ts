import { DataSource } from 'typeorm';
import { Attendance, AttendanceStatus } from '../../modules/attendance/entities/attendance.entity';
import { Employee } from '../../modules/employees/entities/employee.entity';

export async function seedAttendance(dataSource: DataSource): Promise<void> {
  const attendanceRepository = dataSource.getRepository(Attendance);
  const employeeRepository = dataSource.getRepository(Employee);

  // Check if attendance already exist
  const existingAttendance = await attendanceRepository.count();
  if (existingAttendance > 0) {
    console.log('Attendance already seeded');
    return;
  }

  // Get all employees
  const employees = await employeeRepository.find();
  if (employees.length === 0) {
    console.log('No employees found. Please seed employees first.');
    return;
  }

  const attendanceRecords = [];

  // Create attendance for each employee for the last 7 days
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    for (const employee of employees) {
      // Random status for demo
      const statuses = [
        AttendanceStatus.PRESENT,
        AttendanceStatus.PRESENT,
        AttendanceStatus.PRESENT,
        AttendanceStatus.LATE,
        AttendanceStatus.ABSENT,
      ];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      attendanceRecords.push({
        employeeId: employee.id,
        date: dateStr,
        status: status,
        note: status === AttendanceStatus.LATE ? 'Arrived 15 minutes late' : null,
      });
    }
  }

  await attendanceRepository.save(attendanceRecords);
  console.log(`Seeded ${attendanceRecords.length} attendance records`);
}

