const fs = require('fs');

const actionsFile = 'src/components/admin/exercise.management/admin-exercise.actions.tsx';
let actionsContent = fs.readFileSync(actionsFile, 'utf8');
actionsContent = actionsContent.replace('import adminServices from "@/services/admin/admin.services";', 'import { exerciseService } from "@/modules/exercise/service/exercise.service";');
actionsContent = actionsContent.replaceAll('adminServices.toggleExerciseStatus(', 'exerciseService.toggleExerciseStatus(');
fs.writeFileSync(actionsFile, actionsContent);

const formFile = 'src/components/admin/exercise.management/admin-exercise.form.tsx';
let formContent = fs.readFileSync(formFile, 'utf8');
formContent = formContent.replace('import adminServices from "@/services/admin/admin.services";', 'import { exerciseService } from "@/modules/exercise/service/exercise.service";\nimport { targetMuscleService } from "@/modules/target-muscle/service/target-muscle.service";\nimport { equipmentService } from "@/modules/equipment/service/equipment.service";');
formContent = formContent.replace('adminServices.getAllTargetMuscles(', 'targetMuscleService.getAllTargetMuscles(');
formContent = formContent.replace('adminServices.getAllEquipment(', 'equipmentService.getAllEquipment(');
formContent = formContent.replace('adminServices.getExerciseById(', 'exerciseService.getExerciseById(');
formContent = formContent.replace('adminServices.updateExercise(', 'exerciseService.updateExercise(');
formContent = formContent.replace('adminServices.createExercise(', 'exerciseService.createExercise(');
fs.writeFileSync(formFile, formContent);

const listFile = 'src/components/admin/exercise.management/admin-exercise.list.tsx';
let listContent = fs.readFileSync(listFile, 'utf8');
listContent = listContent.replace('import adminServices from "@/services/admin/admin.services";', 'import { exerciseService } from "@/modules/exercise/service/exercise.service";');
listContent = listContent.replace('adminServices.getAllExercises(', 'exerciseService.getAllExercises(');
fs.writeFileSync(listFile, listContent);
