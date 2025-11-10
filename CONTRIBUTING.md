# Contributing to Spritesheet Generator

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- System information (OS, Docker version, browser)

### Suggesting Features

We welcome feature suggestions! Please create an issue with:
- Clear description of the feature
- Use case / why it's needed
- Proposed implementation (if you have ideas)

### Submitting Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```powershell
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
   ```powershell
   git commit -m "Add: feature description"
   ```
6. **Push to your fork**
   ```powershell
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

## 📋 Development Guidelines

### Code Style

**Python (Backend):**
- Follow PEP 8 style guide
- Use type hints where appropriate
- Add docstrings to functions
- Keep functions focused and small

**JavaScript (Frontend):**
- Use functional components
- Follow React best practices
- Use meaningful variable names
- Add comments for complex logic

### Commit Messages

Use clear, descriptive commit messages:
- `Add: new feature description`
- `Fix: bug description`
- `Update: what was updated`
- `Refactor: what was refactored`
- `Docs: documentation changes`

### Testing

Before submitting:
- Test locally with `docker-compose up`
- Verify all features work as expected
- Test on different browsers (if frontend changes)
- Check for console errors
- Verify API documentation updates

## 🔧 Development Setup

### Prerequisites
- Docker Desktop
- Git
- Text editor (VS Code recommended)

### Local Development

**Backend:**
```powershell
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```powershell
cd frontend
npm install
npm run dev
```

**Docker:**
```powershell
docker-compose up --build
```

## 📝 Pull Request Checklist

Before submitting your PR, ensure:
- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Documentation is updated (if needed)
- [ ] Commit messages are clear
- [ ] No commented-out code
- [ ] No console.log statements (frontend)
- [ ] No unnecessary dependencies
- [ ] Docker build succeeds
- [ ] Changes are tested locally

## 🎯 Areas for Contribution

### High Priority
- Additional image format support (JPG, WEBP)
- Performance optimizations
- Error handling improvements
- Unit tests
- Integration tests

### Medium Priority
- UI/UX improvements
- Additional configuration options
- Better mobile responsiveness
- Accessibility improvements
- Internationalization (i18n)

### Nice to Have
- Animation preview feature
- Batch processing
- Frame reordering
- Cloud storage integration
- User authentication

## 🐛 Bug Fix Process

1. Identify and reproduce the bug
2. Create an issue (if not exists)
3. Create a branch: `fix/bug-description`
4. Fix the bug
5. Add test to prevent regression (if possible)
6. Submit PR with reference to issue

## ✨ Feature Development Process

1. Discuss feature in an issue first
2. Get approval from maintainers
3. Create branch: `feature/feature-name`
4. Implement feature
5. Update documentation
6. Submit PR with detailed description

## 📚 Documentation

When contributing, please update:
- README.md (if feature affects usage)
- EXAMPLES.md (if adding new use cases)
- COMMANDS.md (if adding new commands)
- Code comments (for complex logic)
- API documentation (for backend changes)

## 🔍 Code Review

All submissions require review. We'll:
- Check code quality
- Verify functionality
- Test locally
- Provide feedback
- Request changes if needed

Please be patient and responsive to feedback!

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 💬 Communication

- **Issues:** For bugs and feature requests
- **Pull Requests:** For code contributions
- **Discussions:** For general questions (if enabled)

## 🙏 Thank You!

Every contribution, no matter how small, is valuable and appreciated. Thank you for helping make this project better!

---

**Questions?** Feel free to open an issue for any questions about contributing.
