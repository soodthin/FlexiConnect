/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.repositories;

import com.soodthin.entity.FollowEmployer;
import com.soodthin.entity.FollowEmployerPK;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author ADMIN
 */
public interface FollowEmployerRepository extends JpaRepository<FollowEmployer, FollowEmployerPK> {

    boolean existsByFollowEmployerPKCandidateIdAndFollowEmployerPKEmployerId(Integer candidateId, Integer employerId);

    void deleteByFollowEmployerPKCandidateIdAndFollowEmployerPKEmployerId(Integer candidateId, Integer employerId);

    List<FollowEmployer> findByFollowEmployerPKCandidateId(Integer candidateId);

    List<FollowEmployer> findByFollowEmployerPK_EmployerIdAndNotifyJobTrue(Integer employerId);

    Optional<FollowEmployer> findByCandidateIdAndEmployerId(int candidateId, int employerId);

}
