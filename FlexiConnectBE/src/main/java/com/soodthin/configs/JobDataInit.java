package com.soodthin.configs;

import com.soodthin.entity.Employer;
import com.soodthin.entity.JobPost;
import com.soodthin.entity.User;
import com.soodthin.repositories.EmployerRepository;
import com.soodthin.repositories.JobPostRepository;
import com.soodthin.repositories.UserRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Component
@Order(1)
public class JobDataInit implements CommandLineRunner {

    @Autowired
    private JobPostRepository jobPostRepo;

    @Autowired
    private EmployerRepository employerRepo;

    @Autowired
    private UserRepository userRepo;

    @Override
    public void run(String... args) {
        if (jobPostRepo.count() > 0) {
            System.out.println("✔️ Job data already loaded. Skipping import.");
            return;
        }

        System.out.println("📥 Importing job data from Excel...");

        try (InputStream is = new ClassPathResource("jobs_company.xlsx").getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0);
            int lineNumber = 0;

            for (Row row : sheet) {
                if (lineNumber++ == 0) {
                    continue; // Skip header
                }
                try {
                    String companyName = getCellString(row.getCell(0));
                    String jobTitle = getCellString(row.getCell(1));
                    String jobType = getCellString(row.getCell(2));
                    String positionLevel = getCellString(row.getCell(3));
                    String city = getCellString(row.getCell(4));
                    String experience = getCellString(row.getCell(5));
                    String skills = getCellString(row.getCell(6));
                    String jobFields = getCellString(row.getCell(7));
                    double salaryMin = row.getCell(8).getNumericCellValue();
                    double salaryMax = row.getCell(9).getNumericCellValue();

                    // Create or find user
                    String fakeEmail = companyName.toLowerCase().replaceAll("\\s+", "") + "@demo.com";
                    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
                    User user = userRepo.findByEmail(fakeEmail).orElseGet(() -> {
                        User u = new User();
                        u.setEmail(fakeEmail);
                        u.setPassword(encoder.encode("123456"));
                        u.setStatus("ACTIVE");
                        u.setCreatedAt(LocalDateTime.now());
                        return userRepo.save(u);
                    });

                    // Create or find employer
                    Employer employer = employerRepo.findByCompanyName(companyName).orElseGet(() -> {
                        Employer e = new Employer();
                        e.setCompanyName(companyName);
                        e.setUserId(user);
                        e.setIsVerified(false);
                        return employerRepo.save(e);
                    });

                    // Create job post
                    JobPost job = new JobPost();
                    job.setTitle(jobTitle);
                    job.setEmployerId(employer);
                    job.setJobType(jobType);
                    job.setLocation(city);
                    job.setSalaryMin(BigDecimal.valueOf(salaryMin));
                    job.setSalaryMax(BigDecimal.valueOf(salaryMax));
                    job.setDescription(
                            "📌 Position: " + positionLevel
                            + "\n🔧 Experience: " + experience
                            + "\n💼 Skills: " + skills
                            + "\n🏷️ Fields: " + jobFields
                    );
                    job.setStatus("OPEN");
                    job.setViewCount(0);

                    LocalDateTime now = LocalDateTime.now();
                    job.setCreatedAt(now);
                    job.setExpiredAt(now.plusDays(30));

                    jobPostRepo.save(job);

                } catch (Exception e) {
                    System.err.println("❌ Error at row " + lineNumber + ": " + e.getMessage());
                }
            }

            System.out.println("✅ Job import completed.");

        } catch (Exception e) {
            System.err.println("❌ Error during import: " + e.getMessage());
        }
    }

    private String getCellString(Cell cell) {
        if (cell == null) {
            return "";
        }
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                return String.valueOf((int) cell.getNumericCellValue()).trim();
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue()).trim();
            default:
                return "";
        }
    }
}
