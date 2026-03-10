package com.campustrack.controller;

import com.campustrack.entity.Booking;
import com.campustrack.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingRepository.save(booking);
    }

    @GetMapping("/user/{email}")
    public List<Booking> getUserBookings(@PathVariable String email) {
        return bookingRepository.findByUserEmail(email);
    }

    @PutMapping("/{id}")
    public Booking updateBooking(@PathVariable Long id, @RequestBody Booking updated) {
        Optional<Booking> existing = bookingRepository.findById(id);
        if (existing.isPresent()) {
            Booking b = existing.get();
            if (updated.getStartTime() != null)
                b.setStartTime(updated.getStartTime());
            if (updated.getEndTime() != null)
                b.setEndTime(updated.getEndTime());
            if (updated.getPlace() != null)
                b.setPlace(updated.getPlace());
            if (updated.getPhone() != null)
                b.setPhone(updated.getPhone());
            if (updated.getUserEmail() != null)
                b.setUserEmail(updated.getUserEmail());
            if (updated.getStatus() != null)
                b.setStatus(updated.getStatus());
            if (updated.getItemName() != null)
                b.setItemName(updated.getItemName());
            return bookingRepository.save(b);
        }
        return null;
    }

    @PutMapping("/{id}/complete")
    public Booking markComplete(@PathVariable Long id) {
        Optional<Booking> existing = bookingRepository.findById(id);
        if (existing.isPresent()) {
            Booking b = existing.get();
            b.setStatus("completed");
            return bookingRepository.save(b);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void cancelBooking(@PathVariable Long id) {
        bookingRepository.deleteById(id);
    }
}
