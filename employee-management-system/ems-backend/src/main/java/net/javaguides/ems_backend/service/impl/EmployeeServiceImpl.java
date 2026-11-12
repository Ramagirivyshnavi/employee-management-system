//package net.javaguides.ems_backend.service.impl;
//
//import lombok.AllArgsConstructor;
//import net.javaguides.ems_backend.dto.EmployeeDto;
//import net.javaguides.ems_backend.entity.Employee;
//import net.javaguides.ems_backend.exception.ResourceNotFoundException;
//import net.javaguides.ems_backend.mapper.EmployeeMapper;
//import net.javaguides.ems_backend.repository.EmployeeRepository;
//import net.javaguides.ems_backend.service.EmployeeService;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//import static org.antlr.v4.runtime.tree.xpath.XPath.findAll;
//
//@Service
//@AllArgsConstructor
//
//public class EmployeeServiceImpl implements EmployeeService {
//    private EmployeeRepository employeeRepository;
//
//    @Override
//    public EmployeeDto createEmployee(EmployeeDto employeeDto) {
//        Employee employee= EmployeeMapper.mapToEmployee(employeeDto);
//        Employee savedEmployee= employeeRepository.save(employee);
//        return EmployeeMapper.mapToEmployeeDto(savedEmployee);
//    }
//
//    @Override
//    public EmployeeDto getEmployeeById(Long employeeId) {
//        Employee employee =  employeeRepository.findById(employeeId)
//                .orElseThrow(() ->new ResourceNotFoundException("Employee is not exist with given id:" + employeeId));
//        return EmployeeMapper.mapToEmployeeDto(employee);
//    }
//
//    @Override
//    public List<EmployeeDto> getAllEmployees() {
//        List<Employee>employees= employeeRepository.findAll();
//        return employees.stream().map((employee) -> EmployeeMapper.mapToEmployeeDto(employee))
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public EmployeeDto updateEmployee(Long employeeId, EmployeeDto updatedEployee) {
//       Employee employee= employeeRepository.findById(employeeId).orElseThrow(
//                ()-> new ResourceNotFoundException("Employee is not exists with given id:" + employeeId)
//        );
//       employee.setFirstName(updatedEployee.getFirstName());
//        employee.setLastName(updatedEployee.getLastName());
//        employee.setEmail(updatedEployee.getEmail());
//        Employee updatedEmployeeObj= employeeRepository.save(employee);
//
//        return EmployeeMapper.mapToEmployeeDto(updatedEmployeeObj);
//    }
//
//    @Override
//    public void deleteEmployee(Long employeeId) {
//
//        Employee employee= employeeRepository.findById(employeeId).orElseThrow(
//                ()-> new ResourceNotFoundException("Employee is not exists with given id:" + employeeId)
//        );
//        employeeRepository.deleteById(employeeId);
//    }
//}


package net.javaguides.ems_backend.service.impl;

import lombok.AllArgsConstructor;
import net.javaguides.ems_backend.dto.EmployeeDto;
import net.javaguides.ems_backend.entity.Employee;
import net.javaguides.ems_backend.exception.ResourceNotFoundException;
import net.javaguides.ems_backend.mapper.EmployeeMapper;
import net.javaguides.ems_backend.repository.EmployeeRepository;
import net.javaguides.ems_backend.service.EmployeeService;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@AllArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private EmployeeRepository employeeRepository;

    @Override
    public EmployeeDto createEmployee(EmployeeDto employeeDto) {
        if (employeeRepository.existsByEmail(employeeDto.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already exists. Please use another email address."
            );
        }
        Employee employee = EmployeeMapper.mapToEmployee(employeeDto);
        Employee savedEmployee = employeeRepository.save(employee);
        return EmployeeMapper.mapToEmployeeDto(savedEmployee);
    }

    @Override
    public EmployeeDto getEmployeeById(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee does not exist with given id: " + employeeId));

        return EmployeeMapper.mapToEmployeeDto(employee);
    }

    @Override
    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAll()
                .stream()
                .map(EmployeeMapper::mapToEmployeeDto)
                .toList();
    }

//    @Override
//    public EmployeeDto updateEmployee(Long employeeId, EmployeeDto updatedEmployee) {
//        Employee employee = employeeRepository.findById(employeeId)
//                .orElseThrow(() -> new ResourceNotFoundException(
//                        "Employee does not exist with given id: " + employeeId));
//
//        employee.setFirstName(updatedEmployee.getFirstName());
//        employee.setLastName(updatedEmployee.getLastName());
//        employee.setEmail(updatedEmployee.getEmail());
//        employee.setDepartment(updatedEmployee.getDepartment());
//        employee.setDesignation(updatedEmployee.getDesignation());
//
//        Employee savedEmployee = employeeRepository.save(employee);
//        return EmployeeMapper.mapToEmployeeDto(savedEmployee);
//    }

    @Override
    public void deleteEmployee(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee does not exist with given id: " + employeeId));

        employeeRepository.delete(employee);
    }
    @Override
    public EmployeeDto updateEmployee(Long employeeId, EmployeeDto updatedEmployee) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee does not exist with given id: " + employeeId));

        if (employeeRepository.existsByEmailAndIdNot(
                updatedEmployee.getEmail(), employeeId)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already exists. Please use another email address."
            );
        }

        employee.setFirstName(updatedEmployee.getFirstName());
        employee.setLastName(updatedEmployee.getLastName());
        employee.setEmail(updatedEmployee.getEmail());
        employee.setDepartment(updatedEmployee.getDepartment());
        employee.setDesignation(updatedEmployee.getDesignation());

        Employee savedEmployee = employeeRepository.save(employee);

        return EmployeeMapper.mapToEmployeeDto(savedEmployee);
    }
}

