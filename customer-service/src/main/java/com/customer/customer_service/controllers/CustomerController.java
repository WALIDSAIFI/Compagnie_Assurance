package com.customer.customer_service.controllers;

import com.customer.customer_service.dtos.requestDTO.CustomerRequestDTO;
import com.customer.customer_service.dtos.responseDTO.CustomerResponseDTO;
import com.customer.customer_service.service.inter.CustomerService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
//@RequiredArgsConstructor
@RequestMapping("/customers")
public class CustomerController {


    private final CustomerService customerService;
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping
    public ResponseEntity<CustomerResponseDTO> addCustomer(@Valid @RequestBody CustomerRequestDTO customerRequestDTO) {
        CustomerResponseDTO savedCustomer = customerService.addCustomer(customerRequestDTO);
        return ResponseEntity.ok(savedCustomer);
    }

    @GetMapping
    public ResponseEntity<List<CustomerResponseDTO>> getAllCustomers() {
        List<CustomerResponseDTO> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> getCustomerById(@PathVariable Long id) {
        CustomerResponseDTO customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(customer);
    }

    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> checkCustomerExists(@PathVariable Long id) {
        boolean exists = customerService.checkCustomerExists(id);
        return ResponseEntity.ok(exists);
    }
}
