const fs = require('fs');
const file = 'src/components/admin/traget-muscle.management/admin.target-muscle.list.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace('import adminServices from "@/services/admin/admin.services";', 'import { targetMuscleService } from "@/modules/target-muscle/service/target-muscle.service";');
content = content.replace('return adminServices.getAllTargetMuscles({', 'return targetMuscleService.getAllTargetMuscles({');
fs.writeFileSync(file, content);
