import { execSync } from 'child_process';

export const setUpPrismaTests = () => {
  execSync('npm run prisma:migrate-test');
};
