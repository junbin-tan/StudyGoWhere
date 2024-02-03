package com.sgw.backend.repository;


import com.sgw.backend.entity.Advertisement;
import com.sgw.backend.entity.AdvertisementStatusEnum;
import com.sgw.backend.entity.Billable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdvertisementRepository extends JpaRepository<Advertisement, Long> {
    //dont override default methods
    List<Advertisement> findAllByAdvertisementStatus(AdvertisementStatusEnum advertisementStatus);

    List<Advertisement> findAllByAdvertisementStatusNot(AdvertisementStatusEnum advertisementStatus);
}
