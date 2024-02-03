package com.sgw.backend.service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgw.backend.misc.OrderEmitter;
import jakarta.persistence.criteria.Order;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LiveOrderSSEService {
    private final List<OrderEmitter> liveOrderEmitters = new ArrayList<OrderEmitter>();

    public void addEmitter(OrderEmitter newLiveOrderEmitter) {
        liveOrderEmitters.add(newLiveOrderEmitter);
    }

    public void removeEmitter(Long venueId) {
        OrderEmitter toRemove = null;
        for (OrderEmitter o : liveOrderEmitters) {
            if (o.getVenueId() == venueId) {
                toRemove = o;
                break;
            }
        }
        if (toRemove != null) {
            liveOrderEmitters.remove(toRemove);
        }
    }

    public void broadcast(String message, Long venueId) {
        OrderEmitter dead = null;
        int counter = 0;
        for (OrderEmitter o: liveOrderEmitters) {
            System.out.println("Counter: " + counter + " venueId=" + o.getVenueId());
            if (o.getVenueId() == venueId) {
                System.out.println("Found emitter");
                try {
                    ObjectMapper objectMapper = new ObjectMapper();
                    //Instead of message, should be order
//                    String json = objectMapper.writeValueAsString();
                    Map<String, String> testOutput = new HashMap<String, String>();
                    testOutput.put("test", "TEST MESSAGE");
                    o.getEmitter().send(SseEmitter.event().data(testOutput));
                } catch (Exception e) {
                    dead = o;
                    System.out.println("Failed to deliver event message");
                }
                break;
            }
        }
        //Remove stale emitter
        if (dead != null) {
            liveOrderEmitters.remove(dead);
        }
    }
}
