package com.sgw.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sgw.backend.entity_venue.Venue;
import com.sgw.backend.service.QRCodeService;
import com.sgw.backend.service.VenueService;

import java.util.Base64;

@RestController
@RequestMapping(value = "/public")
public class QRCodeController {

    @Autowired
    QRCodeService qrCodeService;

    @Autowired
    VenueService venueService;

    // Standard qr code generator (can be reused)
    // http://localhost:5001/public/generateqrcode?text=sheesh
    @GetMapping(value = "/generateqrcode")
    public ResponseEntity<byte[]> generateQRCode(@RequestParam String text) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);

        try {
            byte[] pngData = qrCodeService.generateQRCode(text);
            return new ResponseEntity<>(pngData, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping(value = "/generateqrcode/venue/{id}")
    public ResponseEntity<byte[]> generateQRCode(@PathVariable("id") Long id) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);

        Venue venue = venueService.getVenueByVenueId(id);

        try {
            String data = venue.getVenueId().toString();

            // Encode the data using base64
            String encodedData = Base64.getEncoder().encodeToString(data.getBytes());

            byte[] pngData = qrCodeService.generateQRCode(encodedData);
            System.out.println("GENERATED QR CODE: " + encodedData);

            return new ResponseEntity<>(pngData, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
