package com.auth.auth.Service.Interface;

import com.auth.auth.DTO.RequestDTO.AuthRequestDTO;
import com.auth.auth.DTO.ResponseDTO.AuthResponseDTO;

public interface AuthService {
    AuthResponseDTO authenticate(AuthRequestDTO request);
    AuthResponseDTO register(AuthRequestDTO request);
}
