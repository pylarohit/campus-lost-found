package com.campustrack.repository;

import com.campustrack.entity.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ResourceRepository extends MongoRepository<Resource, String> {
    List<Resource> findByCategory(String category);
}
