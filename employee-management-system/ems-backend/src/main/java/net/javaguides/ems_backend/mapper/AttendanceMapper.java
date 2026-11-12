
package net.javaguides.ems_backend.mapper;

import net.javaguides.ems_backend.dto.AttendanceDto;
import net.javaguides.ems_backend.entity.Attendance;

public class AttendanceMapper {

    public static AttendanceDto mapToAttendanceDto(Attendance attendance) {
        return new AttendanceDto(
                attendance.getId(),
                attendance.getEmployeeId(),
                attendance.getAttendanceDate(),
                attendance.getCheckIn(),
                attendance.getCheckOut(),
                attendance.getStatus()
        );
    }

    public static Attendance mapToAttendance(AttendanceDto dto) {
        return new Attendance(
                dto.getId(),
                dto.getEmployeeId(),
                dto.getAttendanceDate(),
                dto.getCheckIn(),
                dto.getCheckOut(),
                dto.getStatus()
        );
    }
}

