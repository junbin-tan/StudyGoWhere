package com.sgw.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@RestController
public class DestroyDatabaseController {

    // PLEASE REMOVE THIS IN FINAL VERSION, THIS IS JUST FOR CONVENIENCE
    @Autowired
    private DataSource dataSource;

    @GetMapping("public/destroyDatabase")
    public String destroyDatabase() {
        try {
            Connection connection = dataSource.getConnection();
            DatabaseMetaData metaData = connection.getMetaData();
            ResultSet tables = metaData.getTables(null, null, null, new String[]{"TABLE"});
            List<String> tableNames = new ArrayList<>();
            while (tables.next()) {
                tableNames.add(tables.getString("TABLE_NAME"));
            }

            Statement statement = connection.createStatement();
            for (String tableName : tableNames) {
                statement.executeUpdate("DROP TABLE " + tableName + " CASCADE");
            }

            statement.close();
            connection.close();

            return "DATABASE DESTROYED \n" +
                    "      _.-^^---....,,--       \n" +
                    " _--                  --_  \n" +
                    "<                        >)\n" +
                    "|                         | \n" +
                    " \\._                   _./  \n" +
                    "    ```--. . , ; .--'''       \n" +
                    "          | |   |             \n" +
                    "       .-=||  | |=-.   \n" +
                    "       `-=#$%&%$#=-'   \n" +
                    "          | ;  :|     \n" +
                    " _____.,-#%&$@%#&#~,._____ \n" +
                    "PLEASE RESTART APPLICATION TO REGENERATE SERVER";

        } catch (Exception e) {
            // something went wrong!!
            System.out.println(e);

            return "DATABASE NOT DESTROYED";
        }

    }
}