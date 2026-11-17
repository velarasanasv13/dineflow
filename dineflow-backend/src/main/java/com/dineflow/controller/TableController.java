package com.dineflow.controller;

import com.dineflow.dto.ApiResponse;
import com.dineflow.dto.TableRequest;
import com.dineflow.dto.TableResponse;
import com.dineflow.service.QrCodeService;
import com.dineflow.service.TableService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class TableController {

    private final TableService tableService;
    private final QrCodeService qrCodeService;

    // Public endpoints for customers
    @GetMapping("/api/tables/resolve/{tokenOrNumber}")
    public ResponseEntity<ApiResponse> resolveTable(@PathVariable String tokenOrNumber) {
        TableResponse table = tableService.resolveTable(tokenOrNumber);
        return ResponseEntity.ok(ApiResponse.success("Table resolved", table));
    }

    @GetMapping(value = "/api/tables/{id}/qrcode", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getTableQrCodeImage(@PathVariable Long id) {
        TableResponse table = tableService.getTableById(id);
        byte[] qrBytes = qrCodeService.generateQrCodeImage(table.getQrUrl(), 300, 300);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"table-" + table.getTableNumber() + "-qr.png\"")
                .contentType(MediaType.IMAGE_PNG)
                .body(qrBytes);
    }

    @GetMapping("/api/tables/{id}/qrcode/base64")
    public ResponseEntity<ApiResponse> getTableQrCodeBase64(@PathVariable Long id) {
        TableResponse table = tableService.getTableById(id);
        String base64 = qrCodeService.generateQrCodeBase64(table.getQrUrl(), 300, 300);
        return ResponseEntity.ok(ApiResponse.success("QR code generated", Map.of(
                "base64", base64,
                "qrUrl", table.getQrUrl(),
                "tableNumber", table.getTableNumber()
        )));
    }

    // Admin endpoints
    @GetMapping("/api/admin/tables")
    public ResponseEntity<ApiResponse> getAllTables(
            @RequestParam(value = "activeOnly", defaultValue = "false") boolean activeOnly
    ) {
        List<TableResponse> tables = tableService.getAllTables(activeOnly);
        return ResponseEntity.ok(ApiResponse.success("Tables retrieved", tables));
    }

    @PostMapping("/api/admin/tables")
    public ResponseEntity<ApiResponse> createTable(@Valid @RequestBody TableRequest request) {
        TableResponse response = tableService.createTable(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Table created successfully", response));
    }

    @PutMapping("/api/admin/tables/{id}")
    public ResponseEntity<ApiResponse> updateTable(
            @PathVariable Long id,
            @Valid @RequestBody TableRequest request
    ) {
        TableResponse response = tableService.updateTable(id, request);
        return ResponseEntity.ok(ApiResponse.success("Table updated successfully", response));
    }

    @DeleteMapping("/api/admin/tables/{id}")
    public ResponseEntity<ApiResponse> deleteTable(@PathVariable Long id) {
        tableService.deleteTable(id);
        return ResponseEntity.ok(ApiResponse.success("Table deleted successfully", null));
    }

    @PostMapping("/api/admin/tables/{id}/regenerate-qr")
    public ResponseEntity<ApiResponse> regenerateQr(@PathVariable Long id) {
        TableResponse response = tableService.regenerateQrToken(id);
        return ResponseEntity.ok(ApiResponse.success("QR code token regenerated", response));
    }
}

