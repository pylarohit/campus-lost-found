package com.campustrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.campustrack.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByVerifiedFalse();

    List<User> findByVerifiedTrue();
}
