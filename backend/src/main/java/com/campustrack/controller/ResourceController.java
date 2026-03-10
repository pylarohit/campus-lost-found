package com.campustrack.controller;

import com.campustrack.entity.Resource;
import com.campustrack.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")
public class ResourceController {

    @Autowired
    private ResourceRepository resourceRepository;

    @GetMapping
    public List<Resource> getResources() {
        List<Resource> resources = resourceRepository.findAll();
        if (resources.isEmpty()) {
            return seedResources();
        }
        return resources;
    }

    private List<Resource> seedResources() {
        Resource r1 = new Resource();
        r1.setName("Study Room 101");
        r1.setDescription("Quiet study space with whiteboard and ergonomic chairs.");
        r1.setCategory("Study Room");
        r1.setLocation("Library - 2nd Floor");
        r1.setImageUrl("https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop");
        resourceRepository.save(r1);

        Resource r2 = new Resource();
        r2.setName("Projector Kit B");
        r2.setDescription("High-definition projector with HDMI and wireless casting.");
        r2.setCategory("Equipment");
        r2.setLocation("AV Department");
        r2.setImageUrl("https://images.unsplash.com/photo-1517604931442-7e0c8ed0963c?q=80&w=800&auto=format&fit=crop");
        resourceRepository.save(r2);

        Resource r3 = new Resource();
        r3.setName("VR Lab Seat 4");
        r3.setDescription("Equipped with Meta Quest 3 and specialized development PC.");
        r3.setCategory("Lab Space");
        r3.setLocation("Science Block - Rm 304");
        r3.setImageUrl("https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=800&auto=format&fit=crop");
        resourceRepository.save(r3);

        return resourceRepository.findAll();
    }
}
