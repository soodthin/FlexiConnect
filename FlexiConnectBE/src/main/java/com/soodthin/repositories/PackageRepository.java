/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.soodthin.entity.Package;
/**
 *
 * @author ADMIN
 */
@Repository
public interface PackageRepository extends JpaRepository<Package, Integer> {
}
