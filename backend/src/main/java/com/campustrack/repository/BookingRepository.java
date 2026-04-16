package com.campustrack.repository;

import com.campustrack.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserEmail(String userEmail);

    List<Booking> findByOwnerEmail(String ownerEmail);

    List<Booking> findByResourceId(Long resourceId);
}
