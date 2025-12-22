{/* Main stage */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          px: { xs: 2, sm: 4 },
          py: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: 600, md: 720, lg: 800 },
            position: "relative",
          }}
        >
          {/* Board */}
          <Box
            sx={{
              borderRadius: 6,
              overflow: "hidden",
              boxShadow: "0 22px 60px rgba(0,0,0,0.35)",
              border: "2px solid rgba(255,255,255,0.18)",
              backdropFilter: "blur(2px)",
            }}
          >
            {/* Wood header */}
            <Box
              sx={{
                position: "relative",
                px: { xs: 2.5, sm: 4 },
                pt: { xs: 2.5, sm: 3 },
                pb: { xs: 2, sm: 2.5 },
                background:
                  "linear-gradient(180deg, #6c3f1e 0%, #5a3216 50%, #472510 100%)",
              }}
            >
              {/* leaf/vine accents (pure CSS) */}
              <Box
                aria-hidden
                sx={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  height: 34,
                  opacity: 0.9,
                  background:
                    "radial-gradient(circle at 12% 70%, rgba(110,210,90,0.85) 0 16px, transparent 18px), radial-gradient(circle at 28% 40%, rgba(110,210,90,0.85) 0 18px, transparent 20px), radial-gradient(circle at 78% 55%, rgba(110,210,90,0.85) 0 16px, transparent 18px), radial-gradient(circle at 90% 45%, rgba(110,210,90,0.85) 0 18px, transparent 20px)",
                }}
              />

              <Typography
                sx={{
                  textAlign: "center",
                  fontWeight: 900,
                  letterSpacing: 0.5,
                  color: "#F7E7C6",
                  textShadow:
                    "0 3px 0 rgba(0,0,0,0.35), 0 10px 20px rgba(0,0,0,0.35)",
                  fontSize: { xs: 34, sm: 44 },
                  lineHeight: 1.05,
                  fontFamily:
                    '"Nunito", ui-rounded, system-ui, -apple-system, Segoe UI, Roboto, Arial',
                }}
              >
                Reading Forest
              </Typography>
            </Box>

            {/* Inner parchment panel */}
            <Box
              sx={{
                px: { xs: 2.5, sm: 4 },
                py: { xs: 2.5, sm: 3.5 },
                background:
                  "linear-gradient(180deg, #f3e7cc 0%, #efe0be 45%, #ebd7ab 100%)",
                borderTop: "1px solid rgba(255,255,255,0.35)",
              }}
            >
              <Typography
                sx={{
                  textAlign: "center",
                  fontWeight: 900,
                  fontSize: { xs: 22, sm: 26 },
                  color: "#5A3A22",
                  textShadow: "0 2px 0 rgba(255,255,255,0.35)",
                  mb: 1.5,
                  fontFamily:
                    '"Nunito", ui-rounded, system-ui, -apple-system, Segoe UI, Roboto, Arial',
                }}
              >
                Welcome!
              </Typography>

              <TextField
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Your Name"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon sx={{ color: "rgba(70,40,20,0.7)" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255,255,255,0.65)",
                    borderRadius: 999,
                    boxShadow: "inset 0 2px 0 rgba(255,255,255,0.6)",
                  },
                  "& fieldset": {
                    borderColor: "rgba(90,58,34,0.22)",
                  },
                }}
              />

              <Stack spacing={1.6}>
                {/* Student button */}
                <Button
                  fullWidth
                  size={isSm ? "large" : "large"}
                  startIcon={<BackpackRoundedIcon />}
                  onClick={() => onStudent?.(name)}
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 900,
                    fontSize: { xs: 18, sm: 20 },
                    color: "#103A22",
                    background:
                      "linear-gradient(180deg, #6BE26C 0%, #38B24A 100%)",
                    boxShadow:
                      "0 10px 18px rgba(0,0,0,0.18), inset 0 2px 0 rgba(255,255,255,0.55)",
                    textTransform: "none",
                    "&:hover": {
                      background:
                        "linear-gradient(180deg, #78EE79 0%, #34A845 100%)",
                    },
                  }}
                >
                  I&apos;m a Student
                </Button>

                {/* Adult button */}
                <Button
                  fullWidth
                  size="large"
                  startIcon={<EditNoteRoundedIcon />}
                  onClick={() => onAdult?.(name)}
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 900,
                    fontSize: { xs: 18, sm: 20 },
                    color: "#4A2A10",
                    background:
                      "linear-gradient(180deg, #FFD266 0%, #F0A93B 100%)",
                    boxShadow:
                      "0 10px 18px rgba(0,0,0,0.18), inset 0 2px 0 rgba(255,255,255,0.55)",
                    textTransform: "none",
                    "&:hover": {
                      background:
                        "linear-gradient(180deg, #FFDA7A 0%, #ECA134 100%)",
                    },
                  }}
                >
                  I&apos;m a Grown-Up
                </Button>
              </Stack>

              {/* Today's challenge */}
              <Box sx={{ mt: 2.2 }}>
                <Box
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    border: "1px solid rgba(90,58,34,0.22)",
                    backgroundColor: "rgba(255,255,255,0.45)",
                    boxShadow: "inset 0 2px 0 rgba(255,255,255,0.6)",
                  }}
                >
                  <Box sx={{ px: 2, py: 1.25 }}>
                    <Typography
                      sx={{
                        fontWeight: 900,
                        color: "#3B5A34",
                        fontSize: 16,
                        textAlign: "center",
                      }}
                    >
                      Today’s 🍃 Challenge
                    </Typography>
                  </Box>

                  <Divider sx={{ borderColor: "rgba(90,58,34,0.18)" }} />

                  <Box sx={{ p: 1.6 }}>
                    <Box
                      sx={{
                        width: "100%",
                        height: { xs: 120, sm: 140 },
                        borderRadius: 3,
                        overflow: "hidden",
                        backgroundColor: "rgba(0,0,0,0.06)",
                        border: "1px solid rgba(90,58,34,0.18)",
                      }}
                    >
                      {/* Optional thumbnail; if missing, show a gradient */}
                      <Box
                        component="img"
                        src={''}
                        alt="Today's challenge"
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                        onError={(e) => {
                          // If image doesn't exist, hide it (fallback below stays visible)
                          (e.currentTarget as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                      <Box
                        aria-hidden
                        sx={{
                          display: "none",
                          width: "100%",
                          height: "100%",
                          background:
                            "linear-gradient(135deg, rgba(88,191,255,0.35), rgba(90,210,120,0.25))",
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        mt: 1.2,
                        fontWeight: 800,
                        textAlign: "center",
                        color: "#5A3A22",
                      }}
                    >
                      Explore the Great Wall of China!
                    </Typography>

                    <Button
                      fullWidth
                      onClick={onStart}
                      sx={{
                        mt: 1.4,
                        py: 1.2,
                        borderRadius: 999,
                        fontWeight: 900,
                        fontSize: 20,
                        color: "#0E3A22",
                        background:
                          "linear-gradient(180deg, #86F089 0%, #31B64A 100%)",
                        boxShadow:
                          "0 10px 18px rgba(0,0,0,0.18), inset 0 2px 0 rgba(255,255,255,0.55)",
                        textTransform: "none",
                        "&:hover": {
                          background:
                            "linear-gradient(180deg, #93F896 0%, #2DAA43 100%)",
                        },
                      }}
                    >
                      Start!
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Bottom nav like your screenshot */}
            <Box
              sx={{
                px: { xs: 1.5, sm: 2.2 },
                py: 1.3,
                background:
                  "linear-gradient(180deg, #4A2A12 0%, #3C200D 100%)",
                display: "flex",
                justifyContent: "center",
                gap: 1.2,
                flexWrap: "wrap",
              }}
            >
              <Button
                onClick={onParentsArea}
                startIcon={<LockRoundedIcon />}
                sx={{
                  borderRadius: 3,
                  px: 2.2,
                  py: 0.9,
                  fontWeight: 900,
                  color: "#F7E7C6",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.10)",
                  },
                }}
              >
                Parents Area
              </Button>

              <Button
                onClick={onHelp}
                startIcon={<HelpRoundedIcon />}
                sx={{
                  borderRadius: 3,
                  px: 2.2,
                  py: 0.9,
                  fontWeight: 900,
                  color: "#F7E7C6",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.10)",
                  },
                }}
              >
                Help
              </Button>

              <Button
                onClick={onSettings}
                startIcon={<SettingsRoundedIcon />}
                sx={{
                  borderRadius: 3,
                  px: 2.2,
                  py: 0.9,
                  fontWeight: 900,
                  color: "#F7E7C6",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.10)",
                  },
                }}
              >
                Settings
              </Button>
            </Box>
          </Box>

          {/* Owl mascot (optional) */}
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              right: { xs: 8, sm: -20 },
              bottom: { xs: 70, sm: 64 },
              width: { xs: 140, sm: 180 },
              pointerEvents: "none",
              filter: "drop-shadow(0 14px 18px rgba(0,0,0,0.25))",
            }}
          >
            <Box
              component="img"
              src={''}
              alt=""
              sx={{ width: "100%", height: "auto", display: "block" }}
              onError={(e) => {
                // If owl image doesn't exist, hide silently
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </Box>

          {/* Tiny settings cog like the screenshot bottom-right (optional) */}
          <IconButton
            aria-label="Quick settings"
            onClick={onSettings}
            sx={{
              position: "absolute",
              right: 8,
              bottom: 10,
              width: 42,
              height: 42,
              borderRadius: 3,
              backgroundColor: "rgba(60,32,13,0.78)",
              color: "#F7E7C6",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 10px 16px rgba(0,0,0,0.25)",
              "&:hover": { backgroundColor: "rgba(60,32,13,0.88)" },
            }}
          >
            <SettingsRoundedIcon />
          </IconButton>
        </Box>
      </Box>