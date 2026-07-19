package com.campustrack.repository;

import com.campustrack.entity.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserEmail(String userEmail);

    List<Booking> findByOwnerEmail(String ownerEmail);

    List<Booking> findByResourceId(String resourceId);
}
