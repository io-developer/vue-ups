export default {
    // bit values for APC UPS Status Byte (ups->Status)
    CALIBRATION: 0x00000001,
    TRIM:        0x00000002,
    BOOST:       0x00000004,
    ONLINE:      0x00000008,
    ONBATT:      0x00000010,
    OVERLOAD:    0x00000020,
    BATTLOW:     0x00000040,
    REPLACEBATT: 0x00000080,

    // Extended bit values added by apcupsd
    COMMLOST:    0x00000100, // Communications with UPS lost
    SHUTDOWN:    0x00000200, // Shutdown in progress
    SLAVE:       0x00000400, // Set if this is a slave
    SLAVEDOWN:   0x00000800, // Slave not responding
    ONBATT_MSG:  0x00020000, // Set when UPS_ONBATT message is sent
    FASTPOLL:    0x00040000, // Set on power failure to poll faster
    SHUT_LOAD:   0x00080000, // Set when BatLoad <= percent
    SHUT_BTIME:  0x00100000, // Set when time on batts > maxtime
    SHUT_LTIME:  0x00200000, // Set when TimeLeft <= runtime
    SHUT_EMERG:  0x00400000, // Set when battery power has failed
    SHUT_REMOTE: 0x00800000, // Set when remote shutdown
    PLUGGED:     0x01000000, // Set if computer is plugged into UPS
    BATTPRESENT: 0x04000000, // Indicates if battery is connected
};