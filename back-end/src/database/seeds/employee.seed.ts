import { DataSource } from 'typeorm';
import { Employee } from '../../modules/employees/entities/employee.entity';
import { User, UserRole } from '../../modules/users/entities/user.entity';

export async function seedEmployees(dataSource: DataSource): Promise<void> {
  const employeeRepository = dataSource.getRepository(Employee);
  const userRepository = dataSource.getRepository(User);

  // Check if employees already exist
  const existingEmployees = await employeeRepository.count();
  if (existingEmployees > 0) {
    console.log('Employees already seeded');
    return;
  }

  // Get employee users
  const employeeUsers = await userRepository.find({
    where: { role: UserRole.EMPLOYEE },
  });

  if (employeeUsers.length === 0) {
    console.log('No employee users found. Please seed users first.');
    return;
  }

  // Map users by email for easy lookup
  const userMap = new Map(employeeUsers.map(u => [u.email, u.id]));

  const employees = [
    {
      userId: userMap.get('sarah.johnson@company.com') || null,
      fullName: 'Sarah Johnson',
      age: 32,
      class: 'Senior',
      subjects: ['Mathematics', 'Physics'],
    },
    {
      userId: userMap.get('michael.chen@company.com') || null,
      fullName: 'Michael Chen',
      age: 28,
      class: 'Mid',
      subjects: ['Computer Science', 'Data Analysis'],
    },
    {
      userId: userMap.get('emily.rodriguez@company.com') || null,
      fullName: 'Emily Rodriguez',
      age: 35,
      class: 'Senior',
      subjects: ['Project Management', 'Strategy'],
    },
    {
      userId: userMap.get('david.kim@company.com') || null,
      fullName: 'David Kim',
      age: 26,
      class: 'Junior',
      subjects: ['UI Design', 'User Research'],
    },
  ];

  await employeeRepository.save(employees);
  console.log(`Seeded ${employees.length} employees`);
}
