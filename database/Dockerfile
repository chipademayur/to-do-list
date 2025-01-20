# Stage 1: Build minimal MySQL server
FROM alpine:3.18 AS builder

# Install MySQL and dependencies
RUN apk add --no-cache mysql mysql-client

# Stage 2: Create final runtime image
FROM alpine:3.18

# Create mysql user and group
RUN addgroup -S mysql && adduser -S mysql -G mysql

# Copy MySQL binaries from builder stage
COPY --from=builder /usr/bin /usr/bin
COPY --from=builder /usr/share /usr/share
COPY --from=builder /var/lib/mysql /var/lib/mysql

# Configure MySQL directories and permissions
RUN mkdir /run/mysqld && \
    chown -R mysql:mysql /run/mysqld && \
    chmod 777 /run/mysqld

# Expose MySQL default port
EXPOSE 3306

# Set MySQL environment variables
ENV MYSQL_ALLOW_EMPTY_PASSWORD=yes

# Start MySQL server
CMD ["mysqld", "--user=mysql", "--datadir=/var/lib/mysql"]
