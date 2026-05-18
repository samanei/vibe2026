CREATE DATABASE IF NOT EXISTS vibe2026 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vibe2026;

CREATE TABLE IF NOT EXISTS agendas (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  category             VARCHAR(20) NOT NULL,
  title                VARCHAR(50) NOT NULL,
  problem_description  TEXT NOT NULL,
  improvement_request  TEXT NOT NULL,
  status               VARCHAR(20) NOT NULL DEFAULT '접수됨',
  department           VARCHAR(50) NOT NULL DEFAULT '익명',
  agree_count          INT NOT NULL DEFAULT 0,
  disagree_count       INT NOT NULL DEFAULT 0,
  created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agenda_timeline (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  agenda_id  INT NOT NULL,
  status     VARCHAR(20) NOT NULL,
  comment    TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (agenda_id) REFERENCES agendas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS votes (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  agenda_id  INT NOT NULL,
  user_token VARCHAR(64) NOT NULL,
  vote_type  ENUM('agree', 'disagree') NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_vote (agenda_id, user_token),
  FOREIGN KEY (agenda_id) REFERENCES agendas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inquiries (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  category    VARCHAR(20) NOT NULL,
  title       VARCHAR(100) NOT NULL,
  content     TEXT NOT NULL,
  department  VARCHAR(50) NOT NULL DEFAULT '익명',
  user_token  VARCHAR(64) NOT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT '답변 대기',
  reply       TEXT,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  replied_at  DATETIME
);
