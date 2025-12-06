import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../modules/users/entities/user.entity';
import { Employee } from '../../modules/employees/entities/employee.entity';
import { Attendance, AttendanceStatus } from '../../modules/attendance/entities/attendance.entity';

export async function seedAdditionalData(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);
  const employeeRepository = dataSource.getRepository(Employee);
  const attendanceRepository = dataSource.getRepository(Attendance);

  console.log('Seeding additional 10 users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Check if additional users already exist
  const existingAdditionalUsers = await userRepository.find({
    where: { email: 'john.doe@company.com' },
  });

  if (existingAdditionalUsers.length > 0) {
    console.log('Additional users already seeded. Skipping...');
    return;
  }

  // Generate 10 new users
  const newUsers = [
    {
      username: 'john_doe',
      email: 'john.doe@company.com',
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
    },
    {
      username: 'jane_smith',
      email: 'jane.smith@company.com',
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
    },
    {
      username: 'robert_wilson',
      email: 'robert.wilson@company.com',
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
    },
    {
      username: 'lisa_anderson',
      email: 'lisa.anderson@company.com',
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
    },
    {
      username: 'james_taylor',
      email: 'james.taylor@company.com',
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
    },
    {
      username: 'maria_garcia',
      email: 'maria.garcia@company.com',
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
    },
    {
      username: 'william_martinez',
      email: 'william.martinez@company.com',
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
    },
    {
      username: 'jennifer_lee',
      email: 'jennifer.lee@company.com',
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
    },
    {
      username: 'richard_brown',
      email: 'richard.brown@company.com',
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
    },
    {
      username: 'patricia_davis',
      email: 'patricia.davis@company.com',
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
    },
  ];

  const savedUsers = await userRepository.save(newUsers);
  console.log(`Seeded ${savedUsers.length} additional users`);

  console.log('Seeding additional 10 employees...');
  
  // Generate 10 new employees with random data
  const classes = ['Junior', 'Mid', 'Senior', 'Lead'];
  const subjectsList = [
    ['Web Development', 'JavaScript'],
    ['Backend Development', 'Node.js'],
    ['Frontend Development', 'React'],
    ['Mobile Development', 'React Native'],
    ['DevOps', 'Docker'],
    ['Database', 'PostgreSQL'],
    ['Testing', 'Jest'],
    ['UI/UX Design', 'Figma'],
    ['Project Management', 'Agile'],
    ['Data Science', 'Python'],
  ];

  const newEmployees = savedUsers.map((user, index) => ({
    userId: user.id,
    fullName: [
      'John Doe',
      'Jane Smith',
      'Robert Wilson',
      'Lisa Anderson',
      'James Taylor',
      'Maria Garcia',
      'William Martinez',
      'Jennifer Lee',
      'Richard Brown',
      'Patricia Davis',
    ][index],
    age: 25 + Math.floor(Math.random() * 20), // Random age between 25-44
    class: classes[Math.floor(Math.random() * classes.length)],
    subjects: subjectsList[index],
  }));

  const savedEmployees = await employeeRepository.save(newEmployees);
  console.log(`Seeded ${savedEmployees.length} additional employees`);

  console.log('Seeding attendance data for 2 months...');
  
  // Generate attendance for 2 months (60 days)
  const attendanceRecords = [];
  const today = new Date();
  const twoMonthsAgo = new Date(today);
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  // Get all dates for the last 2 months (excluding weekends for more realistic data)
  const dates: string[] = [];
  const currentDate = new Date(twoMonthsAgo);
  
  while (currentDate <= today) {
    const dayOfWeek = currentDate.getDay();
    // Include all days (Monday = 1, Sunday = 0)
    // You can exclude weekends by: if (dayOfWeek !== 0 && dayOfWeek !== 6)
    const dateStr = currentDate.toISOString().split('T')[0];
    dates.push(dateStr);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Status probabilities (70% present, 15% late, 10% absent, 5% excused)
  const getRandomStatus = (): AttendanceStatus => {
    const rand = Math.random();
    if (rand < 0.70) return AttendanceStatus.PRESENT;
    if (rand < 0.85) return AttendanceStatus.LATE;
    if (rand < 0.95) return AttendanceStatus.ABSENT;
    return AttendanceStatus.EXCUSED;
  };

  // Generate attendance for each employee for each date
  for (const employee of savedEmployees) {
    for (const dateStr of dates) {
      const status = getRandomStatus();
      
      let note: string | null = null;
      if (status === AttendanceStatus.LATE) {
        const lateMinutes = [5, 10, 15, 20, 30];
        note = `Arrived ${lateMinutes[Math.floor(Math.random() * lateMinutes.length)]} minutes late`;
      } else if (status === AttendanceStatus.ABSENT) {
        const reasons = ['Sick leave', 'Personal leave', 'Family emergency'];
        note = reasons[Math.floor(Math.random() * reasons.length)];
      } else if (status === AttendanceStatus.EXCUSED) {
        const reasons = ['Medical appointment', 'Official business', 'Training'];
        note = reasons[Math.floor(Math.random() * reasons.length)];
      }

      attendanceRecords.push({
        employeeId: employee.id,
        date: dateStr,
        status: status,
        note: note,
      });
    }
  }

  // Save in batches to avoid memory issues
  const batchSize = 100;
  for (let i = 0; i < attendanceRecords.length; i += batchSize) {
    const batch = attendanceRecords.slice(i, i + batchSize);
    await attendanceRepository.save(batch);
  }

  console.log(`Seeded ${attendanceRecords.length} attendance records for ${savedEmployees.length} employees over ${dates.length} days`);
}

