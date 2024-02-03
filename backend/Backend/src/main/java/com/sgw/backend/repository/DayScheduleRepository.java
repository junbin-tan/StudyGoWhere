package com.sgw.backend.repository;

import com.sgw.backend.entity_booking.DaySchedule;
import com.sgw.backend.entity_booking.TableType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DayScheduleRepository extends JpaRepository<DaySchedule, Long> {

//    @Query("SELECT ds FROM DaySchedule ds " +
//            "JOIN ds.tableTypeAvailabilities ta " +
//            "WHERE ta.tableType = :tableType")
//    List<DaySchedule> findByTableType(@Param("tableType") TableType tableType);
//
    @Query("SELECT ds FROM DaySchedule ds " +
            "JOIN ds.tableTypeDayAvailabilities tda " +
            "ON tda.tableType = :tableType " +
            "AND ds.published = false")
    List<DaySchedule> findByTableTypeAndIsNotPublished(@Param("tableType") TableType tableType);
}
