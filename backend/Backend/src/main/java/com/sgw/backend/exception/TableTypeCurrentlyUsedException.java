package com.sgw.backend.exception;

import lombok.Getter;

import java.util.List;

@Getter
public class TableTypeCurrentlyUsedException extends RuntimeException {

    public TableTypeCurrentlyUsedException(String message) {
        super(message);
    }

    public TableTypeCurrentlyUsedException(String message, List<Long> dayScheduleIds, List<Long> dayScheduleTemplateIds) {
        super(message);
        this.dayScheduleIds = dayScheduleIds;
        this.dayScheduleTemplateIds = dayScheduleTemplateIds;
    }

    private List<Long> dayScheduleIds;
    private List<Long> dayScheduleTemplateIds;

}
