package com.sgw.backend.misc;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Setter
@Getter
@AllArgsConstructor
public class OrderEmitter {
    private SseEmitter emitter;
    private Long venueId;

}
