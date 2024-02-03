package com.sgw.backend.repository;

import com.sgw.backend.entity_booking.DayScheduleTemplate;
import com.sgw.backend.entity_booking.TableType;
import com.sgw.backend.entity_booking.VenueSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DayScheduleTemplateRepository extends JpaRepository<DayScheduleTemplate, Long> {

    @Query("SELECT dst FROM DayScheduleTemplate dst " +
            "JOIN dst.tableTypeDayAvailabilities tda " +
            "WHERE tda.tableType = :tableType")
    List<DayScheduleTemplate> findByTableType(@Param("tableType") TableType tableType);

    @Query("SELECT dst FROM DayScheduleTemplate dst " +
            "JOIN VenueSchedule vs " +
            "WHERE :dayScheduleTemplate MEMBER OF vs.dayScheduleTemplates")
    List<VenueSchedule> findVenueSchedulesContainingDayScheduleTemplate(@Param("dayScheduleTemplate") DayScheduleTemplate dayScheduleTemplate);
}
