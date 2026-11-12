
package net.javaguides.ems_backend.controller;

import lombok.AllArgsConstructor;
import net.javaguides.ems_backend.dto.DepartmentDto;
import net.javaguides.ems_backend.service.DepartmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private DepartmentService departmentService;

    // Add Department
    @PostMapping
    public ResponseEntity<DepartmentDto> createDepartment(
            @RequestBody DepartmentDto departmentDto) {

        DepartmentDto savedDepartment =
                departmentService.createDepartment(departmentDto);

        return new ResponseEntity<>(savedDepartment, HttpStatus.CREATED);
    }

    // Get Department by ID
    @GetMapping("/{id}")
    public ResponseEntity<DepartmentDto> getDepartmentById(
            @PathVariable Long id) {

        DepartmentDto department =
                departmentService.getDepartmentById(id);

        return ResponseEntity.ok(department);
    }

    // Get All Departments
    @GetMapping
    public ResponseEntity<List<DepartmentDto>> getAllDepartments() {

        List<DepartmentDto> departments =
                departmentService.getAllDepartments();

        return ResponseEntity.ok(departments);
    }

    // Update Department
    @PutMapping("/{id}")
    public ResponseEntity<DepartmentDto> updateDepartment(
            @PathVariable Long id,
            @RequestBody DepartmentDto updatedDepartment) {

        DepartmentDto department =
                departmentService.updateDepartment(id, updatedDepartment);

        return ResponseEntity.ok(department);
    }

    // Delete Department
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDepartment(@PathVariable Long id) {

        departmentService.deleteDepartment(id);

        return ResponseEntity.ok("Department deleted successfully");
    }
}
