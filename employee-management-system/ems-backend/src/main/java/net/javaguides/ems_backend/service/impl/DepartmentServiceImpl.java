
package net.javaguides.ems_backend.service.impl;

import lombok.AllArgsConstructor;
import net.javaguides.ems_backend.dto.DepartmentDto;
import net.javaguides.ems_backend.entity.Department;
import net.javaguides.ems_backend.exception.ResourceNotFoundException;
import net.javaguides.ems_backend.mapper.DepartmentMapper;
import net.javaguides.ems_backend.repository.DepartmentRepository;
import net.javaguides.ems_backend.service.DepartmentService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@AllArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private DepartmentRepository departmentRepository;

    @Override
    public DepartmentDto createDepartment(DepartmentDto departmentDto) {

        if (departmentRepository.existsByDepartmentName(
                departmentDto.getDepartmentName())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Department already exists"
            );
        }

        Department department =
                DepartmentMapper.mapToDepartment(departmentDto);

        Department savedDepartment = departmentRepository.save(department);

        return DepartmentMapper.mapToDepartmentDto(savedDepartment);
    }

    @Override
    public DepartmentDto getDepartmentById(Long departmentId) {

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Department does not exist with given id: " + departmentId));

        return DepartmentMapper.mapToDepartmentDto(department);
    }

    @Override
    public List<DepartmentDto> getAllDepartments() {

        return departmentRepository.findAll()
                .stream()
                .map(DepartmentMapper::mapToDepartmentDto)
                .toList();
    }

    @Override
    public DepartmentDto updateDepartment(
            Long departmentId, DepartmentDto updatedDepartment) {

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Department does not exist with given id: " + departmentId));

        if (!department.getDepartmentName().equalsIgnoreCase(
                updatedDepartment.getDepartmentName())
                && departmentRepository.existsByDepartmentName(
                updatedDepartment.getDepartmentName())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Department already exists"
            );
        }

        department.setDepartmentName(updatedDepartment.getDepartmentName());
        department.setDescription(updatedDepartment.getDescription());

        Department savedDepartment = departmentRepository.save(department);

        return DepartmentMapper.mapToDepartmentDto(savedDepartment);
    }

    @Override
    public void deleteDepartment(Long departmentId) {

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Department does not exist with given id: " + departmentId));

        departmentRepository.delete(department);
    }
}

