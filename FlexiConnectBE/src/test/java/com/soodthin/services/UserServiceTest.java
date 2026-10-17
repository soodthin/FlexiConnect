package com.soodthin.services;

import com.cloudinary.Cloudinary;
import com.soodthin.dto.CandidateRegisterDTO;
import com.soodthin.dto.response.UserLoginResponse;
import com.soodthin.entity.Candidate;
import com.soodthin.entity.Role;
import com.soodthin.entity.User;
import com.soodthin.entity.User.UserStatus;
import com.soodthin.repositories.CandidateRepository;
import com.soodthin.repositories.EmployerRepository;
import com.soodthin.repositories.RoleRepository;
import com.soodthin.repositories.UserRepository;
import com.soodthin.services.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private CandidateRepository candidateRepository;

    @Mock
    private EmployerRepository employerRepository;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private Cloudinary cloudinary;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private UserServiceImpl userService;

    private User sampleUser;
    private Role candidateRole;

    @BeforeEach
    void setUp() {
        candidateRole = new Role(1, "CANDIDATE");

        sampleUser = new User();
        sampleUser.setId(100);
        sampleUser.setEmail("test@gmail.com");
        sampleUser.setPassword("encoded_secret");
        sampleUser.setFullName("Nguyen Van A");
        sampleUser.setStatus(UserStatus.ACTIVE);
        sampleUser.setRoleSet(Set.of(candidateRole));
    }

    @Test
    void registerCandidate_Success() {
        CandidateRegisterDTO dto = new CandidateRegisterDTO();
        dto.setEmail("new@gmail.com");
        dto.setPassword("raw_password");
        dto.setFullName("Nguyen Van B");

        User mappedUser = new User();
        mappedUser.setEmail(dto.getEmail());
        mappedUser.setPassword(dto.getPassword());
        mappedUser.setFullName(dto.getFullName());

        when(userRepository.findByEmail(dto.getEmail())).thenReturn(Optional.empty());
        when(modelMapper.map(dto, User.class)).thenReturn(mappedUser);
        when(roleRepository.findByRoleName("CANDIDATE")).thenReturn(Optional.of(candidateRole));
        when(passwordEncoder.encode("raw_password")).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.registerCandidate(dto);

        assertNotNull(result);
        assertEquals(UserStatus.ACTIVE, result.getStatus());
        assertEquals("encoded_pass", result.getPassword());
        verify(userRepository).save(any(User.class));
        verify(candidateRepository).save(any(Candidate.class));
    }

    @Test
    void registerCandidate_EmailAlreadyExists_ThrowsIllegalArgumentException() {
        CandidateRegisterDTO dto = new CandidateRegisterDTO();
        dto.setEmail("test@gmail.com");

        when(userRepository.findByEmail(dto.getEmail())).thenReturn(Optional.of(sampleUser));

        assertThrows(IllegalArgumentException.class, () -> userService.registerCandidate(dto));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void registerCandidate_RoleNotFound_ThrowsIllegalArgumentException() {
        CandidateRegisterDTO dto = new CandidateRegisterDTO();
        dto.setEmail("new@gmail.com");

        User mappedUser = new User();
        mappedUser.setEmail(dto.getEmail());

        when(userRepository.findByEmail(dto.getEmail())).thenReturn(Optional.empty());
        when(modelMapper.map(dto, User.class)).thenReturn(mappedUser);
        when(roleRepository.findByRoleName("CANDIDATE")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> userService.registerCandidate(dto));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("raw_secret", "encoded_secret")).thenReturn(true);

        UserLoginResponse response = userService.login("test@gmail.com", "raw_secret");

        assertNotNull(response);
        assertEquals("test@gmail.com", response.getEmail());
        assertEquals("CANDIDATE", response.getRole());
        assertNotNull(response.getToken());
    }

    @Test
    void login_WrongPassword_ThrowsBadCredentialsException() {
        when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("wrong_secret", "encoded_secret")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> userService.login("test@gmail.com", "wrong_secret"));
    }

    @Test
    void login_BannedUser_ThrowsDisabledException() {
        sampleUser.setStatus(UserStatus.BANNED);
        when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("raw_secret", "encoded_secret")).thenReturn(true);

        assertThrows(DisabledException.class, () -> userService.login("test@gmail.com", "raw_secret"));
    }

    @Test
    void login_DeletedUser_ThrowsDisabledException() {
        sampleUser.setStatus(UserStatus.DELETED);
        when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("raw_secret", "encoded_secret")).thenReturn(true);

        assertThrows(DisabledException.class, () -> userService.login("test@gmail.com", "raw_secret"));
    }

    @Test
    void getUserByEmail_NotFound_ThrowsUsernameNotFoundException() {
        when(userRepository.findByEmail("unknown@gmail.com")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> userService.getUserByEmail("unknown@gmail.com"));
    }

    @Test
    void getCurrentUser_InvalidToken_ThrowsBadCredentialsException() {
        assertThrows(BadCredentialsException.class, () -> userService.getCurrentUser("invalid_token"));
    }
}
