
package net.javaguides.ems_backend.service;

import net.javaguides.ems_backend.dto.AttendanceDto;

import java.util.List;

public interface AttendanceService {

    AttendanceDto createAttendance(AttendanceDto attendanceDto);

    AttendanceDto getAttendanceById(Long id);

    List<AttendanceDto> getAllAttendance();

    AttendanceDto updateAttendance(
            Long id,
            AttendanceDto attendanceDto
    );

    void deleteAttendance(Long id);
}

