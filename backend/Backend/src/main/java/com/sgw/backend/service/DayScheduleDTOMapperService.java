package com.sgw.backend.service;

import com.sgw.backend.dto.BookingDTO;
import com.sgw.backend.dto.DayScheduleDTO;
import com.sgw.backend.dto.TableTypeBookingSlotDTO;
import com.sgw.backend.dto.TableTypeDayAvailabilityDTO;
import com.sgw.backend.entity.Student;
import com.sgw.backend.entity_booking.Booking;
import com.sgw.backend.entity_booking.DaySchedule;
import com.sgw.backend.entity_booking.TableTypeBookingSlot;
import com.sgw.backend.entity_booking.TableTypeDayAvailability;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Function;
// not really a service, can serve as simply a util class lol
@Service
public class DayScheduleDTOMapperService {
    public static Function<Booking, BookingDTO> getBookingMapper() {
        return DayScheduleDTOMapperService::mapBookingToBookingDTO;
    }

    public static BookingDTO mapBookingToBookingDTO(Booking b) {
        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.setBillableId(b.getBillableId());
        bookingDTO.setBillableName(b.getBillableName());
        bookingDTO.setBillablePrice(b.getBillablePrice());
        bookingDTO.setBookStatus(b.getBookStatus());
        bookingDTO.setFromDateTime(b.getFromDateTime());
        bookingDTO.setToDateTime(b.getToDateTime());
        bookingDTO.setTableTypeBookingSlots(b.getTableTypeBookingSlots().stream().map(DayScheduleDTOMapperService::mapTableTypeBookingSlotToTableTypeBookingSlotDTO).toList());

        return bookingDTO;
    }

    public static TableTypeBookingSlotDTO mapTableTypeBookingSlotToTableTypeBookingSlotDTO(TableTypeBookingSlot ttbs) {
        return new TableTypeBookingSlotDTO(
                ttbs.getId(),
                ttbs.getFromDateTime(),
                ttbs.getToDateTime(),
                ttbs.getTableTypeId(),
                ttbs.getTableTypeName(),
                ttbs.getTablesAvailable(),
                ttbs.getSlotBasePrice(),
                ttbs.getSlotPricePerHalfHour()
        );
    }
    public static Function<TableTypeBookingSlot, TableTypeBookingSlotDTO> getTableTypeBookingSlotMapper() {
        return (ttbs) -> {
            return new TableTypeBookingSlotDTO(
                    ttbs.getId(),
                    ttbs.getFromDateTime(),
                    ttbs.getToDateTime(),
                    ttbs.getTableTypeId(),
                    ttbs.getTableTypeName(),
                    ttbs.getTablesAvailable(),
                    ttbs.getSlotBasePrice(),
                    ttbs.getSlotPricePerHalfHour()
            );
        };
    }

//    public static void updateDaySchedule(DayScheduleDTO dayScheduleDTO, DaySchedule daySchedule) {
//        if (dayScheduleDTO != null && daySchedule != null) {
//            // Update basic properties
//            daySchedule.setDate(dayScheduleDTO.getDate());
//            daySchedule.setPublished(dayScheduleDTO.isPublished());
//
//            // Update or add TableTypeDayAvailability entities
//            List<TableTypeDayAvailability> currentList = daySchedule.getTableTypeDayAvailabilities();
//            List<TableTypeDayAvailabilityDTO> updatedList = dayScheduleDTO.getTableTypeDayAvailabilities();
//
//            if (currentList != null && updatedList != null) {
//                // Iterate through the updatedList and update or add entities
//                for (TableTypeDayAvailabilityDTO updatedDTO : updatedList) {
//                    TableTypeDayAvailability existingEntity = currentList.stream()
//                            .filter(entity -> entity.getId() == updatedDTO.getId())
//                            .findFirst()
//                            .orElse(null);
//
//                    if (existingEntity != null) {
//                        // Update existing entity
//                        updateTableTypeDayAvailability(updatedDTO, existingEntity);
//                    } else {
//                        // Add new entity
//                        currentList.add(createTableTypeDayAvailability(updatedDTO));
//                    }
//                }
//
//                // Remove entities not present in the updatedList
//                removeEntitiesNotInUpdatedList(currentList, updatedList);
//            }
//        }
//    }
//
//    public static void updateTableTypeDayAvailability(DayScheduleDTO.TableTypeDayAvailabilityDTO ttdaDTO, TableTypeDayAvailability ttda) {
//
//    }


}
