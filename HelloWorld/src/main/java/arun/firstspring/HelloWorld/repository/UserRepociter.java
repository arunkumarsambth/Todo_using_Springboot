package arun.firstspring.HelloWorld.repository;

import arun.firstspring.HelloWorld.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepociter extends JpaRepository <User,Long>{
    Optional<User> findByEmail(String email);
}
