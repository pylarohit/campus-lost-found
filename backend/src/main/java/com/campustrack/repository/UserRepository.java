package com.campustrack.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.campustrack.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    List<User> findByVerifiedFalse();

    List<User> findByVerifiedTrue();
}
