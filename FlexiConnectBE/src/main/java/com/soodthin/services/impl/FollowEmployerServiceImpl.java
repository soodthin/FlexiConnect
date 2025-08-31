/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services.impl;

import com.soodthin.dto.FollowEmployerDTO;
import com.soodthin.entity.Candidate;
import com.soodthin.entity.Employer;
import com.soodthin.entity.FollowEmployer;
import com.soodthin.entity.FollowEmployerPK;
import com.soodthin.repositories.CandidateRepository;
import com.soodthin.repositories.EmployerRepository;
import com.soodthin.repositories.FollowEmployerRepository;
import com.soodthin.services.FollowEmployerService;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author ADMIN
 */
@Transactional
@Service
public class FollowEmployerServiceImpl implements FollowEmployerService {

    @Autowired
    private FollowEmployerRepository followEmployerRepository;
    @Autowired

    private CandidateRepository candidateRepository;
    @Autowired

    private EmployerRepository employerRepository;

    @Override
    public FollowEmployerDTO follow(Integer candidateId, Integer employerId) {
    
    Optional<FollowEmployer> existing = followEmployerRepository
            .findByCandidateIdAndEmployerId(candidateId, employerId);
    
    if (existing.isPresent()) {
        System.out.println("🔍 Already following - returning existing record");
        FollowEmployer fe = existing.get();
        return new FollowEmployerDTO(
                candidateId,
                employerId,
                fe.getNotifyJob(),
                fe.getFollowedAt()
        );
    } else {
        System.out.println("🔍 Creating new follow record");
        
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate không tồn tại"));
        Employer employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new RuntimeException("Employer không tồn tại"));
        
        FollowEmployerPK pk = new FollowEmployerPK(candidateId, employerId);
        FollowEmployer fe = new FollowEmployer();
        fe.setFollowEmployerPK(pk);
        fe.setCandidate(candidate);
        fe.setEmployer(employer);
        fe.setNotifyJob(true);
        fe.setFollowedAt(LocalDateTime.now());
        
        FollowEmployer saved = followEmployerRepository.save(fe);
        
        // Force flush to ensure data is committed immediately
        followEmployerRepository.flush();
        
        System.out.println("🔍 Saved and flushed follow record");
        
        return new FollowEmployerDTO(
                candidateId,
                employerId,
                saved.getNotifyJob(),
                saved.getFollowedAt()
        );
    }
}
    @Override
    public void unfollow(Integer candidateId, Integer employerId) {
        followEmployerRepository.deleteByFollowEmployerPKCandidateIdAndFollowEmployerPKEmployerId(candidateId, employerId);
    }

    @Override
    public void toggleNotify(Integer candidateId, Integer employerId, Boolean notify) {
        FollowEmployerPK pk = new FollowEmployerPK(candidateId, employerId);
        FollowEmployer fe = followEmployerRepository.findById(pk)
                .orElseThrow(() -> new RuntimeException("Chưa follow"));

        fe.setNotifyJob(notify);
        followEmployerRepository.save(fe);
    }

    @Override
    public boolean isFollowed(Integer candidateId, Integer employerId) {
        return followEmployerRepository.findByCandidateIdAndEmployerId(candidateId, employerId).isPresent();
    }

    @Override
    public boolean getNotifyStatus(Integer candidateId, Integer employerId) {
        return followEmployerRepository.findByCandidateIdAndEmployerId(candidateId, employerId)
                .map(FollowEmployer::getNotifyJob)
                .orElse(false);
    }

}
