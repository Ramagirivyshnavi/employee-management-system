
package net.javaguides.ems_backend.service.impl;

import net.javaguides.ems_backend.dto.AttendanceDto;
import net.javaguides.ems_backend.entity.Attendance;
import net.javaguides.ems_backend.exception.ResourceNotFoundException;
import net.javaguides.ems_backend.mapper.AttendanceMapper;
import net.javaguides.ems_backend.repository.AttendanceRepository;
import net.javaguides.ems_backend.service.AttendanceService;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public AttendanceServiceImpl(
            AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    @Override
    public AttendanceDto createAttendance(AttendanceDto attendanceDto) {
        validateAttendance(attendanceDto);

        Attendance attendance =
                AttendanceMapper.mapToAttendance(attendanceDto);

        attendance.setId(null);

        try {
            Attendance savedAttendance =
                    attendanceRepository.save(attendance);

            return AttendanceMapper.mapToAttendanceDto(savedAttendance);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException(
                    "Attendance already exists for this employee on this date."
            );
        }
    }

    @Override
    public AttendanceDto getAttendanceById(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Attendance not found with id: " + id
                ));

        return AttendanceMapper.mapToAttendanceDto(attendance);
    }

    @Override
    public List<AttendanceDto> getAllAttendance() {
        return attendanceRepository.findAll()
                .stream()
                .map(AttendanceMapper::mapToAttendanceDto)
                .toList();
    }

    @Override
    public AttendanceDto updateAttendance(
            Long id, AttendanceDto attendanceDto) {

        validateAttendance(attendanceDto);

        Attendance existingAttendance =
                attendanceRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Attendance not found with id: " + id
                        ));

        existingAttendance.setEmployeeId(attendanceDto.getEmployeeId());
        existingAttendance.setAttendanceDate(
                attendanceDto.getAttendanceDate());
        existingAttendance.setCheckIn(attendanceDto.getCheckIn());
        existingAttendance.setCheckOut(attendanceDto.getCheckOut());
        existingAttendance.setStatus(attendanceDto.getStatus());

        try {
            Attendance updatedAttendance =
                    attendanceRepository.save(existingAttendance);

            return AttendanceMapper.mapToAttendanceDto(updatedAttendance);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException(
                    "Attendance already exists for this employee on this date."
            );
        }
    }

    @Override
    public void deleteAttendance(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Attendance not found with id: " + id
                ));

        attendanceRepository.delete(attendance);
    }

    private void validateAttendance(AttendanceDto dto) {
        if (dto.getEmployeeId() == null || dto.getEmployeeId() <= 0) {
            throw new IllegalArgumentException(
                    "A valid employee ID is required."
            );
        }

        if (dto.getAttendanceDate() == null) {
            throw new IllegalArgumentException(
                    "Attendance date is required."
            );
        }

        if (dto.getStatus() == null ||
                !(dto.getStatus().equals("Present") ||
                        dto.getStatus().equals("Absent"))) {
            throw new IllegalArgumentException(
                    "Status must be Present or Absent."
            );
        }

        if (dto.getCheckIn() != null &&
                dto.getCheckOut() != null &&
                dto.getCheckOut().isBefore(dto.getCheckIn())) {
            throw new IllegalArgumentException(
                    "Check-out time cannot be before check-in time."
            );
        }
    }
}

