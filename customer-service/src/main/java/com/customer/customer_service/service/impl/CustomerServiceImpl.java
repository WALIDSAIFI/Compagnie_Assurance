package com.customer.customer_service.service.impl;


import com.customer.customer_service.entities.Customer;
import com.customer.customer_service.repositories.CustomerRepository;
import com.customer.customer_service.service.inter.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {


    private final CustomerRepository customerRepository;

    @Override
    public Customer addCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id).orElse(null);
    }

    @Override
    public boolean checkCustomerExists(Long id) {
        return customerRepository.existsById(id);
    }
}
