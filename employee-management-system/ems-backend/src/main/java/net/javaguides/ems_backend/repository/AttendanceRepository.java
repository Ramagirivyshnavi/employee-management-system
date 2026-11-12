
package net.javaguides.ems_backend.repository;

import net.javaguides.ems_backend.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
}

