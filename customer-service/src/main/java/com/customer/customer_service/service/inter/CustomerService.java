package com.customer.customer_service.service.inter;

import com.customer.customer_service.entities.Customer;

import java.util.List;

public interface CustomerService {
    Customer addCustomer(Customer customer);
    List<Customer> getAllCustomers();
    Customer getCustomerById(Long id);
    boolean checkCustomerExists(Long id);
}
