package com.enterprise.iam;

import com.enterprise.iam.domain.Role;
import com.enterprise.iam.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final com.enterprise.iam.repository.RoleRepository roleRepository;
    private final com.enterprise.iam.repository.PermissionRepository permissionRepository;
    // NOTE: We strictly DO NOT seed any users (especially Admins) here for security
    // reasons.
    // Admins must be created via the registration flow (initially) or by existing
    // Admins.

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 1. Create Permissions
        com.enterprise.iam.domain.Permission userRead = createPermissionIfNotFound("USER_READ");
        com.enterprise.iam.domain.Permission userWrite = createPermissionIfNotFound("USER_WRITE");
        com.enterprise.iam.domain.Permission roleRead = createPermissionIfNotFound("ROLE_READ");
        com.enterprise.iam.domain.Permission roleWrite = createPermissionIfNotFound("ROLE_WRITE");

        // 2. Create Roles
        createRoleIfNotFound("USER", java.util.Collections.singleton(userRead));
        createRoleIfNotFound("MODERATOR", java.util.Set.of(userRead, userWrite));
        createRoleIfNotFound("ADMIN", java.util.Set.of(userRead, userWrite, roleRead, roleWrite));

        System.out.println("Default roles and permissions seeded.");
    }

    @Transactional
    private com.enterprise.iam.domain.Permission createPermissionIfNotFound(String name) {
        return permissionRepository.findByName(name)
                .orElseGet(() -> permissionRepository
                        .save(com.enterprise.iam.domain.Permission.builder().name(name).build()));
    }

    @Transactional
    private void createRoleIfNotFound(String name, java.util.Set<com.enterprise.iam.domain.Permission> permissions) {
        Role role = roleRepository.findByName(name)
                .orElse(Role.builder().name(name).build());

        // Add new permissions if needed
        if (role.getPermissions() == null) {
            role.setPermissions(new java.util.HashSet<>());
        }
        // Simplified: Just ensure all passed permissions are present
        role.getPermissions().addAll(permissions);

        roleRepository.save(role);
    }
}
