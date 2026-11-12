
package net.javaguides.ems_backend.controller;

import net.javaguides.ems_backend.dto.AttendanceDto;
import net.javaguides.ems_backend.service.AttendanceService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping
    public ResponseEntity<AttendanceDto> createAttendance(
            @RequestBody AttendanceDto attendanceDto) {

        AttendanceDto savedAttendance =
                attendanceService.createAttendance(attendanceDto);

        return new ResponseEntity<>(
                savedAttendance, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AttendanceDto>> getAllAttendance() {
        return ResponseEntity.ok(
                attendanceService.getAllAttendance());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttendanceDto> getAttendanceById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AttendanceDto> updateAttendance(
            @PathVariable Long id,
            @RequestBody AttendanceDto attendanceDto) {

        return ResponseEntity.ok(
                attendanceService.updateAttendance(id, attendanceDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendance(
            @PathVariable Long id) {

        attendanceService.deleteAttendance(id);
        return ResponseEntity.noContent().build();
    }
}

