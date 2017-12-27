sysctl kernel.perf_event_paranoid=0
sysctl kernel.kptr_restrict=0
sysctl -w net.ipv4.ip_local_port_range="1025 65535"
service lightdm stop