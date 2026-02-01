package com.enterprise.iam;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class IamSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(IamSystemApplication.class, args);
    }

}
