package com.barmanagement.service.impl;

import com.barmanagement.model.BarTable;
import com.barmanagement.payload.request.BarTableRequest;
import com.barmanagement.payload.response.BarTableResponse;
import com.barmanagement.repository.BarTableRepository;
import com.barmanagement.service.BarTableService;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BarTableServiceImpl
        implements BarTableService {


    @Autowired
    private BarTableRepository barTableRepository;


    // ==========================================
    // CREATE TABLE
    // ==========================================

    @Override
    public BarTableResponse createTable(
            BarTableRequest request) {

        validateRequest(request);

        String tableNumber =
                normalize(request.getTableNumber());

        String name =
                normalize(request.getName());


        // ==========================================
        // CHECK DUPLICATE TABLE NUMBER
        // ==========================================

        if (barTableRepository
                .existsByTableNumber(tableNumber)) {

            throw new RuntimeException(
                    "Bar table number already exists: "
                            + tableNumber
            );
        }


        // ==========================================
        // CONVERT ZONE
        // ==========================================

        BarTable.Zone zone =
                parseZone(request.getZone());


        // ==========================================
        // CREATE ENTITY
        // ==========================================

        BarTable table =
                new BarTable();

        table.setTableNumber(tableNumber);

        table.setName(name);

        table.setCapacity(
                request.getCapacity()
        );

        table.setZone(zone);


        // New table is always available
        table.setStatus(
                BarTable.Status.AVAILABLE
        );

        table.setActive(true);


        // ==========================================
        // SAVE
        // ==========================================

        BarTable savedTable =
                barTableRepository.save(table);


        return mapToResponse(savedTable);
    }


    // ==========================================
    // GET ALL TABLES
    // ==========================================

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<BarTableResponse> getAllTables() {

        return barTableRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // ==========================================
    // GET TABLE BY ID
    // ==========================================

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public BarTableResponse getTableById(
            Long id) {

        BarTable table =
                findTableById(id);

        return mapToResponse(table);
    }


    // ==========================================
    // UPDATE TABLE
    // ==========================================

    @Override
    public BarTableResponse updateTable(
            Long id,
            BarTableRequest request) {

        validateRequest(request);

        BarTable table =
                findTableById(id);


        String tableNumber =
                normalize(request.getTableNumber());

        String name =
                normalize(request.getName());


        // ==========================================
        // CHECK DUPLICATE TABLE NUMBER
        // ==========================================

        if (!table.getTableNumber()
                .equalsIgnoreCase(tableNumber)) {

            if (barTableRepository
                    .existsByTableNumber(tableNumber)) {

                throw new RuntimeException(
                        "Bar table number already exists: "
                                + tableNumber
                );
            }
        }


        // ==========================================
        // UPDATE BASIC INFORMATION
        // ==========================================

        table.setTableNumber(tableNumber);

        table.setName(name);

        table.setCapacity(
                request.getCapacity()
        );

        table.setZone(
                parseZone(request.getZone())
        );


        // ==========================================
        // DO NOT CHANGE STATUS HERE
        // ==========================================

        BarTable updatedTable =
                barTableRepository.save(table);


        return mapToResponse(updatedTable);
    }


    // ==========================================
    // UPDATE TABLE STATUS
    // ==========================================

    @Override
    public BarTableResponse updateTableStatus(
            Long id,
            String status) {

        BarTable table =
                findTableById(id);


        // ==========================================
        // INACTIVE TABLE CHECK
        // ==========================================

        if (!Boolean.TRUE.equals(
                table.getActive())) {

            throw new RuntimeException(
                    "Inactive table cannot change status."
            );
        }


        BarTable.Status newStatus =
                parseStatus(status);


        table.setStatus(newStatus);


        BarTable updatedTable =
                barTableRepository.save(table);


        return mapToResponse(updatedTable);
    }


    // ==========================================
    // ACTIVATE TABLE
    // ==========================================

    @Override
    public BarTableResponse activateTable(
            Long id) {

        BarTable table =
                findTableById(id);


        if (Boolean.TRUE.equals(
                table.getActive())) {

            throw new RuntimeException(
                    "Table is already active."
            );
        }


        table.setActive(true);

        table.setStatus(
                BarTable.Status.AVAILABLE
        );


        BarTable updatedTable =
                barTableRepository.save(table);


        return mapToResponse(updatedTable);
    }


    // ==========================================
    // DEACTIVATE TABLE
    // ==========================================

    @Override
    public BarTableResponse deactivateTable(
            Long id) {

        BarTable table =
                findTableById(id);


        if (!Boolean.TRUE.equals(
                table.getActive())) {

            throw new RuntimeException(
                    "Table is already inactive."
            );
        }


        // ==========================================
        // OCCUPIED TABLE CANNOT BE DEACTIVATED
        // ==========================================

        if (table.getStatus()
                == BarTable.Status.OCCUPIED) {

            throw new RuntimeException(
                    "Occupied table cannot be deactivated."
            );
        }


        table.setActive(false);

        table.setStatus(
                BarTable.Status.AVAILABLE
        );


        BarTable updatedTable =
                barTableRepository.save(table);


        return mapToResponse(updatedTable);
    }


    // ==========================================
    // DELETE TABLE
    // ==========================================

    @Override
    public void deleteTable(
            Long id) {

        // Soft delete
        deactivateTable(id);
    }


    // ==========================================
    // FIND TABLE
    // ==========================================

    private BarTable findTableById(
            Long id) {

        if (id == null) {

            throw new RuntimeException(
                    "Table ID is required."
            );
        }


        return barTableRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Bar table not found with id: "
                                        + id
                        )
                );
    }


    // ==========================================
    // VALIDATE REQUEST
    // ==========================================

    private void validateRequest(
            BarTableRequest request) {

        if (request == null) {

            throw new RuntimeException(
                    "Table request cannot be null."
            );
        }


        if (isBlank(
                request.getTableNumber())) {

            throw new RuntimeException(
                    "Table number is required."
            );
        }


        if (isBlank(
                request.getName())) {

            throw new RuntimeException(
                    "Table name is required."
            );
        }


        if (request.getCapacity() == null) {

            throw new RuntimeException(
                    "Table capacity is required."
            );
        }


        if (request.getCapacity() <= 0) {

            throw new RuntimeException(
                    "Table capacity must be greater than 0."
            );
        }


        if (isBlank(
                request.getZone())) {

            throw new RuntimeException(
                    "Table zone is required."
            );
        }


        parseZone(request.getZone());
    }


    // ==========================================
    // PARSE ZONE
    // ==========================================

    private BarTable.Zone parseZone(
            String zone) {

        if (isBlank(zone)) {

            throw new RuntimeException(
                    "Table zone is required."
            );
        }


        try {

            return BarTable.Zone.valueOf(
                    zone.trim().toUpperCase()
            );

        } catch (IllegalArgumentException ex) {

            throw new RuntimeException(
                    "Invalid table zone. Allowed values: "
                            + "COUNTER, LOUNGE, VIP, OUTDOOR"
            );
        }
    }


    // ==========================================
    // PARSE STATUS
    // ==========================================

    private BarTable.Status parseStatus(
            String status) {

        if (isBlank(status)) {

            throw new RuntimeException(
                    "Table status is required."
            );
        }


        try {

            return BarTable.Status.valueOf(
                    status.trim().toUpperCase()
            );

        } catch (IllegalArgumentException ex) {

            throw new RuntimeException(
                    "Invalid table status. Allowed values: "
                            + "AVAILABLE, OCCUPIED, RESERVED, CLEANING"
            );
        }
    }


    // ==========================================
    // NORMALIZE TEXT
    // ==========================================

    private String normalize(
            String value) {

        if (value == null) {
            return "";
        }

        return value
                .trim()
                .replaceAll("\\s+", " ");
    }


    // ==========================================
    // BLANK CHECK
    // ==========================================

    private boolean isBlank(
            String value) {

        return value == null
                || value.trim().isEmpty();
    }


    // ==========================================
    // ENTITY → RESPONSE
    // ==========================================

    private BarTableResponse mapToResponse(
            BarTable table) {

        BarTableResponse response =
                new BarTableResponse();


        response.setId(
                table.getId()
        );

        response.setTableNumber(
                table.getTableNumber()
        );

        response.setName(
                table.getName()
        );

        response.setCapacity(
                table.getCapacity()
        );


        if (table.getZone() != null) {

            response.setZone(
                    table.getZone().name()
            );
        }


        if (table.getStatus() != null) {

            response.setStatus(
                    table.getStatus().name()
            );
        }


        response.setActive(
                table.getActive()
        );

        response.setCreatedAt(
                table.getCreatedAt()
        );

        response.setUpdatedAt(
                table.getUpdatedAt()
        );


        return response;
    }
}