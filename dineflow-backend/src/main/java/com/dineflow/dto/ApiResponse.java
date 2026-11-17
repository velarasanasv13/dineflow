package com.dineflow.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse {
    private boolean success;
    private String message;
    private Object data;

    public static ApiResponse success(String message, Object data) {
        ApiResponse r = new ApiResponse();
        r.success = true;
        r.message = message;
        r.data    = data;
        return r;
    }

    public static ApiResponse success(Object data) {
        ApiResponse r = new ApiResponse();
        r.success = true;
        r.data    = data;
        return r;
    }

    public static ApiResponse success(String message) {
        ApiResponse r = new ApiResponse();
        r.success = true;
        r.message = message;
        return r;
    }

    public static ApiResponse error(String message) {
        ApiResponse r = new ApiResponse();
        r.success = false;
        r.message = message;
        return r;
    }
}
