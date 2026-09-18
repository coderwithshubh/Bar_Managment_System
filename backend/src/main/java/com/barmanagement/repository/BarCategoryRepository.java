package com.barmanagement.repository;

import com.barmanagement.model.BarCategory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BarCategoryRepository
        extends JpaRepository<BarCategory, Long> {

    Optional<BarCategory> findByCategoryCode(
            String categoryCode
    );


    Optional<BarCategory> findByCategoryNameIgnoreCase(
            String categoryName
    );


    boolean existsByCategoryCode(
            String categoryCode
    );


    boolean existsByCategoryNameIgnoreCase(
            String categoryName
    );


    List<BarCategory> findByActiveTrueOrderByDisplayOrderAsc();


    List<BarCategory> findByActiveOrderByDisplayOrderAsc(
            Boolean active
    );
}